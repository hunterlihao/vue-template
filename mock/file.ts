// 文件上传 mock
// 纯前端模式下没有真实的文件服务器,这里把上传的图片解析成 data URL 直接返回,
// 这样 el-upload 上传成功后头像可以正常预览。
import type { IncomingMessage } from 'node:http';
import type { MockMethod } from 'vite-plugin-mock';

/** 允许的图片类型与大小上限 */
const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
];
const MAX_SIZE = 5 * 1024 * 1024;

/** 读取请求体(超过上限直接放弃,避免被超大请求撑爆内存) */
function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let aborted = false;
    req.on('data', (chunk: Buffer) => {
      if (aborted) return;
      size += chunk.length;
      if (size > MAX_SIZE + 64 * 1024) {
        aborted = true;
        resolve(Buffer.alloc(0));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () =>
      resolve(aborted ? Buffer.alloc(0) : Buffer.concat(chunks)),
    );
    req.on('error', () => resolve(Buffer.alloc(0)));
  });
}

/** 解析 multipart/form-data 中的第一个文件片段 */
function parseFirstPart(buffer: Buffer, contentType: string) {
  const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || '');
  const boundary = match ? (match[1] || match[2]).trim() : '';
  if (!boundary) return null;

  const delimiter = Buffer.from(`--${boundary}`);
  let start = buffer.indexOf(delimiter);
  if (start === -1) return null;
  start += delimiter.length;
  // 跳过片段头前的 CRLF
  if (buffer[start] === 0x0d && buffer[start + 1] === 0x0a) start += 2;

  const headerEnd = buffer.indexOf('\r\n\r\n', start);
  if (headerEnd === -1) return null;

  const headers = buffer.subarray(start, headerEnd).toString('utf8');
  const bodyStart = headerEnd + 4;
  let bodyEnd = buffer.indexOf(delimiter, bodyStart);
  if (bodyEnd === -1) bodyEnd = buffer.length;
  // 去掉片段尾部的 CRLF
  if (buffer[bodyEnd - 2] === 0x0d && buffer[bodyEnd - 1] === 0x0a)
    bodyEnd -= 2;

  const mimeMatch = /content-type:\s*([^\r\n;]+)/i.exec(headers);
  return {
    mime: mimeMatch ? mimeMatch[1].trim() : 'application/octet-stream',
    data: buffer.subarray(bodyStart, bodyEnd),
  };
}

async function handleUpload(req: IncomingMessage, res: any) {
  const buffer = await readBody(req);
  const contentType = String(req.headers['content-type'] || '');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  if (buffer.length === 0) {
    res.statusCode = 413;
    res.end(JSON.stringify({ code: 413, message: '文件过大', data: null }));
    return;
  }
  const part = parseFirstPart(buffer, contentType);
  if (!part || part.data.length === 0) {
    res.end(
      JSON.stringify({ code: 500, message: '未接收到上传文件', data: null }),
    );
    return;
  }
  if (!ALLOWED_MIME.includes(part.mime)) {
    res.statusCode = 415;
    res.end(
      JSON.stringify({ code: 415, message: '仅支持图片格式', data: null }),
    );
    return;
  }
  if (part.data.length > MAX_SIZE) {
    res.statusCode = 413;
    res.end(
      JSON.stringify({ code: 413, message: '图片不能超过 5MB', data: null }),
    );
    return;
  }
  const dataUrl = `data:${part.mime};base64,${part.data.toString('base64')}`;
  res.end(JSON.stringify({ code: 200, message: '上传成功', data: dataUrl }));
}

export default [
  {
    url: '/api/admin/file/upload',
    method: 'post',
    rawResponse(req, res) {
      void handleUpload(req, res);
    },
  },
] as MockMethod[];

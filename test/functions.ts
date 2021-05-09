export function testOverlapResponse(body: any) {
  expect(body).toBeDefined();
  expect(body.error).toBeDefined();
  expect(body.error).toHaveProperty('message');
  expect(body.error.message).toEqual('Overlapping events are not allowed');
}

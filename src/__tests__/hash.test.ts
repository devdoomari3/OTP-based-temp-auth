import * as hash from '../hash'

describe('hash util should...', () => {
  it('should work ok', async () => {
    const result = await hash.sha256('123')
    expect(result).toBe('pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=')
    console.log(result)
  })
})
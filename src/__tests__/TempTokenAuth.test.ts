import {
  TemporaryTokenAuth,
} from '../TempTokenAuth'
import { UnixTimestampMin } from '../RotatingTimeSalt';

describe('Temp Token Auth should...', () => {
  it('should work OK', async () => {
    const tempAuth = new TemporaryTokenAuth<string>({
      encoder: a => a,
    })
    const testData = 'hello_world'
    const a = await tempAuth.getOTPTokenWithTimeSlice(testData, 0 as UnixTimestampMin)
    const result = await tempAuth.verifyOTPToken(
      testData, a.otpToken, 
      a.timeSlice, 
      1 as UnixTimestampMin,
    )
    expect(result).toBe(true)
  })
  it('should reject expired', async () => {
    const tempAuth = new TemporaryTokenAuth<string>({
      encoder: a => a,
    })
    const testData = 'hello_world'
    const a = await tempAuth.getOTPTokenWithTimeSlice(testData, 0 as UnixTimestampMin)
    const result = await tempAuth.verifyOTPToken(
      testData, a.otpToken, 
      a.timeSlice, 
      10 as UnixTimestampMin,
    )
    expect(result).toBe(false)
  })
  it('should reject different data', async () => {
    const tempAuth = new TemporaryTokenAuth<string>({
      encoder: a => a,
    })
    const testData = 'hello_world'
    const a = await tempAuth.getOTPTokenWithTimeSlice(testData, 0 as UnixTimestampMin)
    const result = await tempAuth.verifyOTPToken(
      'changed data', a.otpToken, 
      a.timeSlice, 
      1 as UnixTimestampMin,
    )
    expect(result).toBe(false)
  })
})
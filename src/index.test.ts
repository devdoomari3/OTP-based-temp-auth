import { 
  TemporaryTokenAuth,
} from './TempTokenAuth'
import {
  UnixTimestampMin,
} from './RotatingTimeSalt'

describe('TemporaryAuthToken should...', () => {
  it('should test OK', async () => {
    const tempTokenAuth = new TemporaryTokenAuth()
    const data1 = 'data1'
    const otpTokenWithTimeSlice = await tempTokenAuth.getOTPTokenWithTimeSlice(data1, 1 as UnixTimestampMin)
    const test = await tempTokenAuth.verifyOTPToken(
      data1, 
      otpTokenWithTimeSlice.otpToken,
      otpTokenWithTimeSlice.timeSlice,
      1 as UnixTimestampMin
    )
    expect(test).toBe(true)
  })
  it('should reject timed-out', async () => {
    const tempTokenAuth = new TemporaryTokenAuth()
    const data1 = 'data1'
    const otpTokenWithTimeSlice = await tempTokenAuth.getOTPTokenWithTimeSlice(data1, 1 as UnixTimestampMin)
    const test = await tempTokenAuth.verifyOTPToken(
      data1, 
      otpTokenWithTimeSlice.otpToken,
      otpTokenWithTimeSlice.timeSlice,
      10 as UnixTimestampMin
    )
    expect(test).toBe(false)
  })
  it('should reject wrong token', async () => {
    const tempTokenAuth = new TemporaryTokenAuth()
    const data1 = 'data1'
    const otpTokenWithTimeSlice = await tempTokenAuth.getOTPTokenWithTimeSlice(data1, 1 as UnixTimestampMin)
    const test = await tempTokenAuth.verifyOTPToken(
      data1, 
      'hello world',
      otpTokenWithTimeSlice.timeSlice,
      10 as UnixTimestampMin
    )
    expect(test).toBe(false)
  })
})
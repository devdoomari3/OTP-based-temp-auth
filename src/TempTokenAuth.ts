

import * as crypto from 'crypto'
import { 
  RotatingTimeSalt, getCurrentTimestampMin, UnixTimestampMin, TimeSliceMinute 
} from './RotatingTimeSalt';

import {
  sha256,
  sha512,
} from './hash'

export class TemporaryTokenAuth<T> {
  encode: (value: T) => string
  rotatingTimeSalt = new RotatingTimeSalt()

  constructor(args: {
    encoder: (value: T) => string
  }) {
    this.encode = args.encoder
  }
  
  async getOTPTokenWithTimeSlice(data: T, currentTimeStampMin: UnixTimestampMin = getCurrentTimestampMin()) {
    const currentTimeSalt = this.rotatingTimeSalt.getCurrent(currentTimeStampMin)
    const timeSlice = currentTimeSalt.timeSlice
    const salt = await currentTimeSalt.salt
    const otpToken = sha256( // (may as well mix sha256/sha224/etc )
        salt
      + sha512(timeSlice.toString())
      + sha512(this.encode(data))
    )
    return {
      timeSlice,
      otpToken,
    }
  }

  async verifyOTPToken(
    data: T, 
    otpToken: string, 
    timeSlice: TimeSliceMinute, 
    currentTimeStampMin: UnixTimestampMin = getCurrentTimestampMin()
  ) {
    const currentTimeSlice = this.rotatingTimeSalt.getCurrent(currentTimeStampMin).timeSlice
    if (timeSlice && timeSlice < this.rotatingTimeSalt.getMinTimeSlice(currentTimeSlice)) {
      return false
    }
    if (timeSlice) {
      const {
          otpToken: recreatedToken
      } = await this.getOTPTokenWithTimeSlice(data, timeSlice)
      if (otpToken === recreatedToken) {
          return true
      }

    }
    const recreatedToken = await this.getOTPTokenWithTimeSlice(data, currentTimeStampMin)
    return recreatedToken.otpToken === otpToken
  }
}
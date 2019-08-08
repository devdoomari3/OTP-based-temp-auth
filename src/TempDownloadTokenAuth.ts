import { TemporaryTokenAuth } from "./TempTokenAuth";
import { UnixTimestampMin } from "./RotatingTimeSalt";


export type DownloadAuthData = {
  filePath: string;
  userId: string;
}
export class TemporaryDownloadAuthToken {
// } extends TemporaryTokenAuth<DownloadAuthData> {
  tempTokenAuth = new TemporaryTokenAuth<DownloadAuthData>({
    encoder: (v) => `${v.filePath}::${v.userId}`,
  })
  async getOTPAuthenticatedFileURL(data: DownloadAuthData, currentTimestampMin?: UnixTimestampMin) {
    // server_rotating_salt: random string rotated every day / hour / etc
    const currentOTPToken = await this.tempTokenAuth.getOTPTokenWithTimeSlice(data, currentTimestampMin)
    return `${data.filePath}?token=${currentOTPToken.otpToken}&user=${data.userId}&issuedAt=${currentOTPToken.timeSlice}`
  }
  
  async checkFileURLOTPAuth(OTPAuthenticatedFileURL: string) { // does ONLY auth checking
    const parsed = new URL(OTPAuthenticatedFileURL)
    const {
      token,
      user,
      issuedAt,
    } = parsed.searchParams.values()
    const filePath = extractFilePathFromOTPAuthenticatedURL(OTPAuthenticatedFileURL)
    const givenOTPtoken = extractOTPTokenOTPAuthenticatedFileURL(OTPAuthenticatedFileURL)
    const currentOTPtoken = hash( 
    USER_SPECIAL_SALT 
    + time_in_1_min_slices 
    + server_rotating_salt
    + filePath
    )
    const previousOTPtoken = hash( 
    USER_SPECIAL_SALT 
    + (time_in_1_min_slices - 1 min)
    + server_rotating_salt
    + filePath
    )
    if (givenOTPToken !== currentOTPToken && givenOTPToken !== previousOTPToken) {
    throw NotAuthenticatedErrorSomething
    }
    // authorization check
    if (!await isFileAuthorizedFor(user, filePath)) { // not valid JS/TS
    throw NotAuthorizedErrorSomething
    }
    // now authenticated/authorized for file
    return true //
  }
}
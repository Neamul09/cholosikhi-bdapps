const BDAPPS_BASE_URL = import.meta.env.VITE_BDAPPS_BASE_URL || 'https://bdappsdigitalapps.com/CholoSikhi';

export interface BdappsCheckSubResponse {
  subscriptionStatus?: string; // "REGISTERED", "UNREGISTERED", "PENDING_CHARGE", "INITIAL CHARGING PENDING", etc.
  isSubscribed?: boolean;
  isRegistered?: boolean;
  statusCode?: string;
  statusDetail?: string;
  version?: string;
  subscriberId?: string;
  error?: string;
}

export interface BdappsSendOtpResponse {
  success?: boolean;
  alreadyRegistered?: boolean;
  referenceNo?: string;
  statusCode?: string;
  statusDetail?: string;
  message?: string;
  version?: string;
  error?: string;
}

export interface BdappsVerifyOtpResponse {
  statusCode?: string; // "S1000" success, "E1850" invalid OTP
  statusDetail?: string;
  subscriptionStatus?: string;
  subscriberId?: string;
  version?: string;
  error?: string;
}

export interface BdappsUnsubscribeResponse {
  success?: boolean;
  subscriberId?: string;
  action?: string;
  version?: string;
  statusCode?: string;
  statusDetail?: string;
  subscriptionStatus?: string;
  rawResponse?: string;
  error?: string;
}

/**
  Formats mobile number to standard bdapps 8801XXXXXXXXX format
 */
export function formatMobileNumber(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.startsWith('8801') && digits.length === 13) {
    return digits;
  }
  if (digits.startsWith('01') && digits.length === 11) {
    return `88${digits}`;
  }
  if (digits.startsWith('1') && digits.length === 10) {
    return `880${digits}`;
  }
  return digits;
}

async function postFormUrlEncoded<T>(url: string, params: Record<string, string>): Promise<T> {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    body.append(key, value);
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const bdappsService = {
  /**
   * Checks subscription status for a mobile number
   */
  async checkSubscription(mobile: string): Promise<BdappsCheckSubResponse> {
    const formattedMobile = formatMobileNumber(mobile);
    try {
      const data = await postFormUrlEncoded<BdappsCheckSubResponse>(
        `${BDAPPS_BASE_URL}/check_subscription.php`,
        { user_mobile: formattedMobile }
      );

      const rawStatus = (data.subscriptionStatus || '').trim().toUpperCase();
      const isUnregistered = rawStatus === 'UNREGISTERED' || rawStatus === '';
      const isSubscribed = rawStatus === 'REGISTERED';
      const isRegistered = !isUnregistered;

      return {
        ...data,
        subscriptionStatus: rawStatus || 'UNREGISTERED',
        isSubscribed,
        isRegistered,
      };
    } catch (err: any) {
      console.error('[BDApps] checkSubscription error:', err);
      return {
        isSubscribed: false,
        isRegistered: false,
        subscriptionStatus: 'UNREGISTERED',
        error: err?.message || 'Failed to check subscription',
      };
    }
  },

  /**
   * Sends OTP to user's mobile to initiate subscription
   */
  async sendOtp(mobile: string): Promise<BdappsSendOtpResponse> {
    const formattedMobile = formatMobileNumber(mobile);
    try {
      const data = await postFormUrlEncoded<BdappsSendSendResponseRaw>(
        `${BDAPPS_BASE_URL}/send_otp.php`,
        { user_mobile: formattedMobile }
      );

      const detail = (data.statusDetail || data.message || '').toLowerCase();
      const isAlreadyReg = data.statusCode === 'E1351' || detail.includes('already registered');

      if (isAlreadyReg) {
        return {
          ...data,
          success: false,
          alreadyRegistered: true,
          statusDetail: 'user already registered',
        };
      }

      return data;
    } catch (err: any) {
      console.error('[BDApps] sendOtp error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to send OTP',
      };
    }
  },

  /**
   * Verifies OTP using referenceNo
   */
  async verifyOtp(otp: string, referenceNo: string): Promise<BdappsVerifyOtpResponse> {
    try {
      const data = await postFormUrlEncoded<BdappsVerifyOtpResponse>(
        `${BDAPPS_BASE_URL}/verify_otp.php`,
        { Otp: otp, referenceNo }
      );
      return data;
    } catch (err: any) {
      console.error('[BDApps] verifyOtp error:', err);
      return {
        statusCode: 'E9999',
        statusDetail: err?.message || 'Failed to verify OTP',
        error: err?.message || 'Failed to verify OTP',
      };
    }
  },

  /**
   * Unsubscribes mobile number from service
   */
  async unsubscribe(mobile: string): Promise<BdappsUnsubscribeResponse> {
    const formattedMobile = formatMobileNumber(mobile);
    try {
      const data = await postFormUrlEncoded<BdappsUnsubscribeResponse>(
        `${BDAPPS_BASE_URL}/unsubscribe.php`,
        { user_mobile: formattedMobile }
      );
      return data;
    } catch (err: any) {
      console.error('[BDApps] unsubscribe error:', err);
      return {
        success: false,
        subscriptionStatus: 'UNREGISTERED',
        error: err?.message || 'Failed to unsubscribe',
      };
    }
  },
};

type BdappsSendSendResponseRaw = BdappsSendOtpResponse;

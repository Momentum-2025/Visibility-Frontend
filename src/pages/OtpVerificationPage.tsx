import React, { useState, useRef, type KeyboardEvent, type ChangeEvent, type ClipboardEvent } from 'react';
import styles from './OtpVerificationPage.module.css';

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus on the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      alert('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Navigate to next page or show success message
      alert('OTP Verified Successfully!');
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setOtp(new Array(6).fill(''));
    inputRefs.current[0]?.focus();
    // Add your resend OTP logic here
    alert('OTP has been resent to your email');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Verify Your Email</h1>
        <p className={styles.subtitle}>
          We've sent a 6-digit code to your email
        </p>
        <p className={styles.email}>email@company.com</p>

        <div className={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {inputRefs.current[index] = el}}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={styles.otpInput}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={isLoading || otp.some(digit => !digit)}
          className={styles.verifyButton}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>

        <div className={styles.resendContainer}>
          <span className={styles.resendText}>Didn't receive the code?</span>
          <button onClick={handleResend} className={styles.resendButton}>
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
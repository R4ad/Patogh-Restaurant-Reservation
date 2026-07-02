namespace Patogh.Application.Interfaces;

public interface IOtpService
{
    /// <summary>Generates and sends the OTP; returns the generated code.</summary>
    Task<string> SendOtpAsync(string phoneNumber);
    Task<bool> VerifyOtpAsync(string phoneNumber, string code);
}
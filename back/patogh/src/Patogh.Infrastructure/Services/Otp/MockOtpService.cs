using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Patogh.Application.Interfaces;
using Patogh.Infrastructure.Configurations;

namespace Patogh.Infrastructure.Services.Otp;

/// <summary>
/// In-memory OTP service used when Redis is not configured.
/// Accepts a fixed code (configured via OtpSettings:DevOtpCode, default "123456")
/// so developers can test OTP flows via Swagger without a real phone.
///
/// NEVER register this in Production — it accepts any request with the dev code.
/// </summary>
public class MockOtpService : IOtpService
{
    private readonly ILogger<MockOtpService> _logger;
    private readonly string _devCode;

    public MockOtpService(
        ILogger<MockOtpService> logger,
        IOptions<OtpSettings> settings)
    {
        _logger = logger;
        _devCode = settings.Value.DevOtpCode;
    }

    public Task<string> SendOtpAsync(string phoneNumber)
    {
        // Print dev code to console only — NOT to structured logs which may be shipped externally.
        Console.ForegroundColor = ConsoleColor.Magenta;
        Console.WriteLine($"  [MOCK OTP] Phone: {phoneNumber}  Code: {_devCode}  (DEVELOPMENT ONLY)");
        Console.ResetColor();

        _logger.LogWarning(
            "[MOCK OTP] ⚠ Development-only OTP sent for {Phone}. " +
            "MockOtpService MUST NOT run in Production.",
            phoneNumber);
        return Task.FromResult(_devCode);
    }

    public Task<bool> VerifyOtpAsync(string phoneNumber, string code)
    {
        var isValid = code == _devCode;
        // Log result only — do NOT log the submitted code itself.
        _logger.LogInformation(
            "[MOCK OTP] Verify attempt for {Phone}: {Result}",
            phoneNumber, isValid ? "ACCEPTED" : "REJECTED");
        return Task.FromResult(isValid);
    }
}

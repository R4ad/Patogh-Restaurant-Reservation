using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Patogh.Application.Interfaces;
using Patogh.Domain.Entities;
using Patogh.Domain.Enums;

namespace Patogh.Application.Features.Auth.Commands.SendOtp;

public class SendOtpCommandHandler : IRequestHandler<SendOtpCommand, SendOtpResponseDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IOtpService _otpService;
    private readonly IHostEnvironment _env;

    public SendOtpCommandHandler(
        IApplicationDbContext context,
        IOtpService otpService,
        IHostEnvironment env)
    {
        _context = context;
        _otpService = otpService;
        _env = env;
    }

    public async Task<SendOtpResponseDto> Handle(
        SendOtpCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(
                x => x.PhoneNumber == request.PhoneNumber,
                cancellationToken);

        var isNewUser = false;
        if (user is null)
        {
            isNewUser = true;
            user = new User
            {
                PhoneNumber = request.PhoneNumber,
                PasswordHash = string.Empty,
                Role = UserRole.Customer
            };
            await _context.Users.AddAsync(user, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        var generatedOtp = await _otpService.SendOtpAsync(request.PhoneNumber);

        var response = new SendOtpResponseDto
        {
            Success   = true,
            IsNewUser = isNewUser,
            Message   = $"کد تأیید به شماره {request.PhoneNumber} ارسال شد."
        };

        // Expose the actual generated OTP only in Development so Swagger/Postman
        // testers can copy it without a real phone.
        if (_env.IsDevelopment())
            response.DevOtp = generatedOtp;

        return response;
    }
}
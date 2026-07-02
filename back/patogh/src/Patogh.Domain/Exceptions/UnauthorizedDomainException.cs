namespace Patogh.Domain.Exceptions;

public class UnauthorizedDomainException : DomainException
{
    public UnauthorizedDomainException()
        : base("دسترسی غیرمجاز.") { }

    public UnauthorizedDomainException(string message)
        : base(message) { }
}
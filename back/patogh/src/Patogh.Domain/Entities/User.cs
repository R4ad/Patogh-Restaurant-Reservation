using Patogh.Domain.Common;
using Patogh.Domain.Enums;

namespace Patogh.Domain.Entities;

public class User : BaseEntity
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Customer;
    public string? DisplayName { get; set; }
    public string? AvatarUrl { get; set; }

    // Navigation
    public ICollection<Restaurant> OwnedRestaurants { get; set; }
        = new List<Restaurant>();

    public ICollection<Reservation> Reservations { get; set; }
        = new List<Reservation>();
}

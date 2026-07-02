using Patogh.Domain.Common;

namespace Patogh.Domain.Entities;

public class UserFavorite : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid RestaurantId { get; set; }

    public User User { get; set; } = null!;
    public Restaurant Restaurant { get; set; } = null!;
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Patogh.Domain.Entities;

namespace Patogh.Persistence.Configurations;

public class UserFavoriteConfiguration : IEntityTypeConfiguration<UserFavorite>
{
    public void Configure(EntityTypeBuilder<UserFavorite> builder)
    {
        builder.ToTable("UserFavorites");
        builder.HasKey(x => x.Id);

        builder.HasIndex(x => new { x.UserId, x.RestaurantId })
            .IsUnique()
            .HasDatabaseName("IX_UserFavorites_UserId_RestaurantId");

        builder.HasIndex(x => x.RestaurantId)
            .HasDatabaseName("IX_UserFavorites_RestaurantId");

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Restaurant)
            .WithMany()
            .HasForeignKey(x => x.RestaurantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

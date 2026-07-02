using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Patogh.Application.Features.Favorites.Commands.AddFavorite;
using Patogh.Application.Features.Favorites.Commands.RemoveFavorite;
using Patogh.Application.Features.Favorites.Queries.GetFavorites;

namespace Patogh.API.Controllers;

[ApiController]
[Route("api/favorites")]
[Authorize(Roles = "Customer")]
[EnableRateLimiting("general")]
public class FavoritesController : ControllerBase
{
    private readonly IMediator _mediator;

    public FavoritesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>لیست علاقه‌مندی‌های مشتری جاری</summary>
    [HttpGet]
    public async Task<IActionResult> GetFavorites()
    {
        var result = await _mediator.Send(new GetFavoritesQuery());
        return Ok(result);
    }

    /// <summary>افزودن رستوران به علاقه‌مندی‌ها</summary>
    [HttpPost("{restaurantId:guid}")]
    public async Task<IActionResult> AddFavorite(Guid restaurantId)
    {
        await _mediator.Send(new AddFavoriteCommand(restaurantId));
        return StatusCode(201);
    }

    /// <summary>حذف رستوران از علاقه‌مندی‌ها</summary>
    [HttpDelete("{restaurantId:guid}")]
    public async Task<IActionResult> RemoveFavorite(Guid restaurantId)
    {
        await _mediator.Send(new RemoveFavoriteCommand(restaurantId));
        return Ok(new { message = "از علاقه‌مندی‌ها حذف شد." });
    }
}

using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.Review;
using PortfolioCMS.Server.Application.Extensions;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class ReviewService : IReviewService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public ReviewService(ApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<IReadOnlyList<ReviewResponse>> GetAllAsync()
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var reviews = await _context.Reviews
                .AsNoTracking()
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return ReviewMapper.ToResponseList(reviews);
        }

        public async Task<ReviewResponse> GetByIdAsync(Guid id)
        {
            var entity = await FindOwnedReviewAsync(id);
            return ReviewMapper.ToResponse(entity);
        }

        public async Task<ReviewResponse> CreateAsync(CreateReviewRequest request)
        {
            var userId = _currentUserService.GetUserIdOrThrow();
            var entity = ReviewMapper.ToEntity(request, userId);

            await _context.Reviews.AddAsync(entity);
            await _context.SaveChangesAsync();

            return ReviewMapper.ToResponse(entity);
        }

        public async Task<ReviewResponse> UpdateAsync(Guid id, UpdateReviewRequest request)
        {
            var entity = await FindOwnedReviewAsync(id);

            ReviewMapper.ApplyUpdate(request, entity);
            await _context.SaveChangesAsync();

            return ReviewMapper.ToResponse(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await FindOwnedReviewAsync(id);
            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        private async Task<Review> FindOwnedReviewAsync(Guid id)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            return await _context.Reviews
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId)
                ?? throw new AppNotFoundException($"Review with ID '{id}' was not found.");
        }
    }
}

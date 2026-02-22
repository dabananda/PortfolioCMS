using PortfolioCMS.Server.Application.DTOs.Review;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Mappings
{
    public static class ReviewMapper
    {
        public static ReviewResponse ToResponse(Review entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return new ReviewResponse
            {
                Id = entity.Id,
                Name = entity.Name,
                Designation = entity.Designation,
                Rating = entity.Rating,
                Comment = entity.Comment,
                UserId = entity.UserId,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static IReadOnlyList<ReviewResponse> ToResponseList(IEnumerable<Review> entities)
        {
            ArgumentNullException.ThrowIfNull(entities);
            return entities.Select(ToResponse).ToList().AsReadOnly();
        }

        public static Review ToEntity(CreateReviewRequest request, Guid userId)
        {
            ArgumentNullException.ThrowIfNull(request);

            return new Review
            {
                Name = request.Name.Trim(),
                Designation = request.Designation?.Trim(),
                Rating = request.Rating,
                Comment = request.Comment.Trim(),
                UserId = userId
            };
        }

        public static void ApplyUpdate(UpdateReviewRequest request, Review entity)
        {
            ArgumentNullException.ThrowIfNull(request);
            ArgumentNullException.ThrowIfNull(entity);

            entity.Name = request.Name.Trim();
            entity.Designation = request.Designation?.Trim();
            entity.Rating = request.Rating;
            entity.Comment = request.Comment.Trim();
        }
    }
}

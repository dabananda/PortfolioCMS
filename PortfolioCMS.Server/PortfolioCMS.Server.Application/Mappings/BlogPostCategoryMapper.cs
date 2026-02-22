using PortfolioCMS.Server.Application.DTOs.BlogPostCategory;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Mappings
{
    public static class BlogPostCategoryMapper
    {
        public static BlogPostCategoryResponse ToResponse(BlogPostCategory entity, int postCount = 0)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return new BlogPostCategoryResponse
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                UserId = entity.UserId,
                PostCount = postCount,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static IReadOnlyList<BlogPostCategoryResponse> ToResponseList(IEnumerable<BlogPostCategory> entities)
        {
            ArgumentNullException.ThrowIfNull(entities);
            return entities.Select(e => ToResponse(e, e.BlogPosts.Count)).ToList().AsReadOnly();
        }

        public static BlogPostCategory ToEntity(CreateBlogPostCategoryRequest request, Guid userId)
        {
            ArgumentNullException.ThrowIfNull(request);

            return new BlogPostCategory
            {
                Name = request.Name.Trim(),
                Description = request.Description?.Trim(),
                UserId = userId
            };
        }

        public static void ApplyUpdate(UpdateBlogPostCategoryRequest request, BlogPostCategory entity)
        {
            ArgumentNullException.ThrowIfNull(request);
            ArgumentNullException.ThrowIfNull(entity);

            entity.Name = request.Name.Trim();
            entity.Description = request.Description?.Trim();
        }
    }
}

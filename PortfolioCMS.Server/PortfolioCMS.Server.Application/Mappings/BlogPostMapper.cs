using PortfolioCMS.Server.Application.DTOs.BlogPost;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Mappings
{
    public static class BlogPostMapper
    {
        public static BlogPostResponse ToResponse(BlogPost entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return new BlogPostResponse
            {
                Id = entity.Id,
                Title = entity.Title,
                Slug = entity.Slug,
                Summary = entity.Summary,
                Content = entity.Content,
                ImageUrl = entity.ImageUrl,
                IsPublished = entity.IsPublished,
                PublishedAt = entity.PublishedAt,
                BlogPostCategoryId = entity.BlogPostCategoryId,
                CategoryName = entity.BlogPostCategory?.Name ?? string.Empty,
                UserId = entity.UserId,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static IReadOnlyList<BlogPostResponse> ToResponseList(IEnumerable<BlogPost> entities)
        {
            ArgumentNullException.ThrowIfNull(entities);
            return entities.Select(ToResponse).ToList().AsReadOnly();
        }

        public static BlogPostPagedResponse ToPagedResponse(
            IEnumerable<BlogPost> pageItems, int totalCount, int page, int pageSize)
        {
            return new BlogPostPagedResponse
            {
                Items = ToResponseList(pageItems),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public static BlogPost ToEntity(CreateBlogPostRequest request, Guid userId, string slug)
        {
            ArgumentNullException.ThrowIfNull(request);

            return new BlogPost
            {
                Title = request.Title.Trim(),
                Slug = slug,
                Summary = request.Summary?.Trim(),
                Content = request.Content.Trim(),
                ImageUrl = request.ImageUrl?.Trim(),
                IsPublished = false,
                BlogPostCategoryId = request.BlogPostCategoryId,
                UserId = userId
            };
        }

        public static void ApplyUpdate(UpdateBlogPostRequest request, BlogPost entity, string slug)
        {
            ArgumentNullException.ThrowIfNull(request);
            ArgumentNullException.ThrowIfNull(entity);

            entity.Title = request.Title.Trim();
            entity.Slug = slug;
            entity.Summary = request.Summary?.Trim();
            entity.Content = request.Content.Trim();
            entity.ImageUrl = request.ImageUrl?.Trim();
            entity.BlogPostCategoryId = request.BlogPostCategoryId;
        }
    }
}

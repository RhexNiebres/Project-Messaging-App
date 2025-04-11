import PostItem from "./PostItem";

const PostList = ({ posts, onPostUpdated, onPostDeleted }) => {
    return (
      <div>
  {posts.map((post) => (
    <PostItem key={post.id} post={post} onPostUpdated={onPostUpdated} onPostDeleted={onPostDeleted} />
  ))}
  {posts.length === 0 && <p>No posts available.</p>}
</div>

    );
  };
  
  export default PostList;
  
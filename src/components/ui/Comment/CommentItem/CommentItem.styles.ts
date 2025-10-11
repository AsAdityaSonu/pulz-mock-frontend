import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  bubble: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 15,
    lineHeight: 20,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  timestamp: {
    fontSize: 12,
    marginRight: 16,
  },
  likeButton: {
    marginRight: 16,
  },
  likeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  replyButton: {
    marginRight: 12,
  },
  replyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  viewRepliesButton: {
    marginLeft: 4,
  },
  viewRepliesText: {
    fontSize: 12,
    fontWeight: '600',
  },
  repliesContainer: {
    marginTop: 8,
    marginLeft: 0,
  },
  replyContainer: {
    flexDirection: 'row',
    marginBottom: 14,
    paddingLeft: 4,
  },
  replyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  replyAvatarText: {
    fontSize: 14,
  },
  replyContent: {
    flex: 1,
  },
  replyBubble: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 7,
  },
  replyAuthorName: {
    fontSize: 14,
    marginBottom: 3,
  },
  replyTimestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 14,
  },
  replyTimestamp: {
    fontSize: 12,
    marginRight: 14,
  },
  replyLikeButton: {
    marginRight: 14,
  },
  replyLikeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  replyReplyButton: {},
  replyReplyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  replyContentText: {
    fontSize: 15,
    lineHeight: 20,
  },
});

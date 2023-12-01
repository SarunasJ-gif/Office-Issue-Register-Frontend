// eslint-disable-next-line react/jsx-filename-extension
import { FC, useState } from 'react';
import { Box, Container, Divider, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';

import CommentForm from './Comment';
import AddCommentForm from './AddComment';
import { COLORS } from '../../values/colors';

import { createCommentApi, updateCommentApi } from 'src/api/CommentApi';
import { Employee } from 'src/models/EmployeeModel';
import { AddComment, Comment } from 'src/models/CommentModel';
import { addCommentToIssue } from 'src/actions/issues/IssuesAction';
import store from 'src/store/store';


type CommentsProps = {
  issueId: string,
  currentUser: Employee,
  issueComments: Comment[],
  updateComments: (newComments: Comment[]) => void;
  issueStatus: string,
};

const Comments: FC<CommentsProps> = ({issueId, currentUser, issueComments, updateComments, issueStatus}) => {
  const [comments, setComments] = useState<Comment[]>(issueComments);
  const [activeComment, setActiveComment] = useState<string | null>(null);

  const dispatch = useDispatch();
  const issues = store.getState().rootReducer.issues.issues;

  const rootComments = comments.filter((comment) => comment.parentId === null);

  const getReplies = (commentId: string) =>
    comments.filter((comment) => comment.parentId === commentId).sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );


  const handleUpvote = (commentId: string, issueId: string) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return updateCommentApi(comment.id, issueId).then((updatedCommentFromApi) => {
          return updatedCommentFromApi;
        });
      } else {
        return comment;
      }
    });
    Promise.all(updatedComments).then((updatedCommentsArray) => {
      const filteredUpdatedComments = updatedCommentsArray.filter((comment) => comment !== undefined);
      setComments(filteredUpdatedComments as Comment[]);
    });
  };


  const addComment = (text: string,  parentId: string | null, issueId: string, currentUserId: string) => {
    if (text.trim() === '') {
      setActiveComment(null);
    } else {
    const newComment: AddComment = {
      text: text,
      time: new Date(),
      votes: 0,
      parentId: parentId ,
      issueId: issueId,
      employeeId: currentUserId
    };
    createCommentApi(newComment).then((comment) => {
      setComments([comment, ...comments]);
      setActiveComment(null);
      updateComments([comment, ...comments]);
      const currentIssue = issues.find((issue) => issue.id === issueId);
      const updatedIssue = {
        ...currentIssue,
        commentCount: currentIssue.commentCount + 1,
      };
      dispatch(addCommentToIssue(issueId, updatedIssue));
    });
  }
  };


  return (
    <Container sx={{width: '115%', padding: 0}}>
    <Box mt={3} sx={{ marginLeft: 0, width: '100%'}}>
      {rootComments.map((rootComment) => (
        <Paper key={rootComment.id} elevation={0} sx={{ p: 2, mt: 2, marginLeft: -11, marginRight: 'auto', width: '100%' }}>
          <CommentForm
          issueId={issueId}
          comment={rootComment}
          employee={rootComment.employee}
          replies={getReplies(rootComment.id)}
          activeComment={activeComment}
          setActiveComment={setActiveComment}
          addComment={addComment}
          currentUser={currentUser}
          onUpvote={handleUpvote}
          issueStatus={issueStatus}
          />
        </Paper>
      ))}
    </Box>
    {issueStatus !== 'Closed' && (
    <Box mt={3} sx={{
          position: 'sticky',
          bottom: '0',
          left: '20px',
          width: '120%',
          p: 2,
          backgroundColor: COLORS.white,
          marginLeft: -13,
        }}
    >
      <Divider/>
      <AddCommentForm
      issueId={issueId}
      currentUser={currentUser}
      parentId={null}
      handleSubmit={addComment}
      picture={currentUser.avatar}
      submitLabel='Add comment'
      />
    </Box>
    )}
    </Container>
  );
};

export default Comments;



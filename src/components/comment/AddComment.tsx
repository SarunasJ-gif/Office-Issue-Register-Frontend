import {  FC, useState } from 'react';
import { Box, CardContent, TextField, Avatar } from '@mui/material';

type AddCommentProps = {
  picture: string,
  issueId: string,
  currentUserId: string,
  parentId: string | null
  handleSubmit: (issueId: string, currentUserId: string, text: string, parentId: string | null) => void,

  submitLabel: string,
  initialText?: string,
};


const AddCommentForm: FC<AddCommentProps> = ({
  picture,
  issueId,
  currentUserId,
  parentId,
  handleSubmit,
  initialText = '',
}) => {
  const [text, setText] = useState(initialText);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit(issueId, currentUserId, text, parentId);
    setText('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit(event as React.FormEvent);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: 'none',
        marginBottom: 2,
        width: '100%',
      }}
    >
        <Avatar src={picture} alt={`${picture} Photo`} sx={{ width: 40, height: 40, marginLeft: 4 }} />
      <CardContent sx={{ flex: 5, paddingTop: 2 }}>
        <form onSubmit={onSubmit}>
          <TextField
            fullWidth
            multiline
            rows={1}
            variant="outlined"
            label="Add comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </form>
      </CardContent>
    </Box>
  );
};

export default AddCommentForm;



import { Box, styled, TextField } from "@mui/material";
import { useField } from "formik";

const Input = styled(TextField)(({ theme }) => ({
  width: "100%",
  fontSize: "13px",
}));

const Field = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <Box width="100%" my={2}>
      <Input
        label={label}
        {...field}
        {...props}
        // fullWidth
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error}
      />
    </Box>
  );
};

export default Field;

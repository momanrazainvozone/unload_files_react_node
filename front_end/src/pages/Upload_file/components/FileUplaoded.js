import Alert from "@mui/material/Alert";
export function FileUplaoded(props) {
  return (
    <div>
      {props.isFileUplaoded ? (
        <Alert severity="success" color="info">
          File uplaod success fully
        </Alert>
      ) : null}
    </div>
  );
}

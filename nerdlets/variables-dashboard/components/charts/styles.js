export const chartsStyle = {
  flex: 1,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  minWidth: "300px",
};

export const chartInnerStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
}

export const chartErrorStyle = {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%,  -50%)",
  zIndex: 2,
  color: 'red'
}

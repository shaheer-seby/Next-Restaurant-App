const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#fce4ec", // light pink background
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "1rem",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "2rem",
      boxShadow: "0 4px 12px rgba(142, 36, 170, 0.2)", // soft purple shadow
      maxWidth: "400px",
      width: "100%",
      textAlign: "center",
    },
    avatar: {
      width: "80px",
      borderRadius: "50%",
      marginBottom: "1rem",
    },
    heading: {
      marginBottom: "1.5rem",
      color: "#8e24aa", // deep purple
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    input: {
      padding: "0.75rem",
      marginBottom: "1rem",
      border: "1px solid #ce93d8", // light purple border
      borderRadius: "8px",
      fontSize: "1rem",
      outlineColor: "#ab47bc", // on focus
    },
    buttonPrimary: {
      padding: "0.75rem",
      backgroundColor: "#d81b60", // bold pink
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "1rem",
      transition: "background 0.3s",
      marginBottom: "0.5rem",
    },
    buttonSecondary: {
      padding: "0.75rem",
      backgroundColor: "#f8bbd0", // light pink
      color: "#6a1b9a", // purple text
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "1rem",
      transition: "background 0.3s",
    },
    link: {
      marginTop: "1rem",
      color: "#8e24aa", // purple link
      textDecoration: "underline",
      cursor: "pointer",
      fontSize: "0.95rem",
    },
  };
  
  export default styles;
  
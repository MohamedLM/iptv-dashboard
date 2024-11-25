import { Body, Container, Head, Hr, Html, Markdown } from "@react-email/components";

interface PanelCredentialsEmailProps {
  markdown: string;
}

export const PanelCredentialsEmail = ({
  markdown,
}: PanelCredentialsEmailProps) => (
  <Html>
    <Head />
    {/* <Preview>Your iptv credentials access information.</Preview> */}
    <Body style={main}>
      <Container style={container}>
        <Markdown children={markdown} />
        <Hr style={hr} />
        {/* <Text style={footer}>
          Footer is here
        </Text> */}
      </Container>
    </Body>
  </Html>
);

PanelCredentialsEmail.PreviewProps = {
  markdown: `# Welcome

This is a **live demo** of MDXEditor with all default features on.

> *username: test*
> *password: oke*

> *username:  \`test\`*
> *password: \`oke\`*`,
} as PanelCredentialsEmailProps;

export default PanelCredentialsEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149",
};

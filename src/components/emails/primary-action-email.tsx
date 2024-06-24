import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  renderAsync,
} from "@react-email/components";

import * as React from "react"; 

interface EmailTemplateProps {
  actionLabel: string;
  buttonText: string;
  href: string;
}

export const EmailTemplate = ({
  href,
  actionLabel,
  buttonText,
}: EmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>La marketplace des produits numériques de qualité.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}/hippo-newsletter-sign-up.png`}
            width="150"
            height="150"
            alt="DigitalHippo"
            style={logo}
          />
          <Text style={paragraph}>Bienvenue,</Text>
          <Text style={paragraph}>
            Bienvenue sur DigitalHippo, la marketplace des produits numériques
            de qualité. Utilisez le bouton ci-dessous pour {actionLabel}.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={href}>
              {buttonText}
            </Button>
          </Section>
          <Text style={paragraph}>
            Meilleure,
            <br />
            L&apos;équipe DigitalHippo
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Si vous n&apos;avez pas demandé cet e-mail, vous pouvez l&apos;ignorer en
            toute sécurité.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export const PrimaryActionEmail = (props: EmailTemplateProps) =>
  renderAsync(<EmailTemplate {...props} />, { pretty: true });

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
  padding: "12px 12px",
  backgroundColor: "#2563eb",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};

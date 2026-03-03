export const metadata = {
  title: 'Cidade Sombra',
  description: 'MVP deployable build for the Cidade Sombra web game.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', background: '#05070d', color: '#f5f7ff' }}>
        {children}
      </body>
    </html>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <title>Platform Diskusi</title>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#151912' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: '#151912',
        }}>
          {children}
        </div>
      </body>
    </html>
  );
}

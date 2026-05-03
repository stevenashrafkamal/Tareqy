export const template = (token, frontEndBaseUrl) => {
  return `
  <div style="font-family: 'Fira Code', 'Courier New', Courier, monospace; padding: 40px 20px; background-color: #0d1117; color: #c9d1d9; text-align: center;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #161b22; padding: 40px 30px; border-radius: 8px; border: 1px solid #30363d; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
      
      <div style="margin-bottom: 25px;">
        <h1 style="color: #58a6ff; margin: 0; font-size: 32px; letter-spacing: -1px;">&lt;Tareqy /&gt;</h1>
      </div>

      <h2 style="margin: 0 0 15px 0; color: #f0f6fc; font-size: 22px; border-bottom: 1px solid #30363d; padding-bottom: 10px; display: inline-block;">
        Hello, World! 🚀
      </h2>
      
      <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #8b949e; margin-bottom: 25px;">
        <span style="color: #ff7b72;">const</span> status = <span style="color: #a5d6ff;">"Almost there!"</span>;<br><br>
        Welcome to Tareqy. To fully initialize your account and join our community of developers, please compile your registration by verifying your email address.
      </p>

      <a href="${frontEndBaseUrl}/auth/verify/${token}"
         style="display: inline-block; padding: 14px 28px; background-color: #238636; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px;">
         > _ Verify.exe
      </a>

      <div style="margin-top: 30px; padding: 15px; background-color: #0d1117; border-radius: 6px; text-align: left; font-size: 13px; color: #8b949e; border: 1px dashed #30363d;">
        <code>
          <span style="color: #8b949e;">// If you didn't request this:</span><br>
          <span style="color: #ff7b72;">throw</span> <span style="color: #79c0ff;">new</span> Error(<span style="color: #a5d6ff;">"Safely ignore this email"</span>);
        </code>
      </div>

      <hr style="border: none; border-top: 1px solid #30363d; margin: 30px 0;">

      <p style="margin-top: 10px; font-size: 12px; color: #484f58; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        © 2026 Tareqy. <span style="color: #d2a8ff;">console</span>.<span style="color: #79c0ff;">log</span>(<span style="color: #a5d6ff;">'All rights reserved.'</span>);
      </p>

    </div>
  </div>
  `;
};

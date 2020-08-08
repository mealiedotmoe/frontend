import * as React from 'react';

export const PageTitle: React.FunctionComponent<{ title: string; className?: string; }> = ({ title, className }): JSX.Element => (
  <section style={{ margin: "16px 0" }} className={className}>
    <div style={{ color: "#D4E9EE", marginBottom: "16px", fontSize: 36, fontWeight: 600 }}>
      {title}
    </div>
    <div style={{ fontWeight: 400, fontSize: 18, color: "rgba(255,255,255,0.6)" }}>
      Mealie.Moe
    </div>
  </section>
)
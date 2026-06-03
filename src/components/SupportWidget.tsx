'use client';

export default function SupportWidget() {
  return (
    <iframe 
      src="https://crm.zawrindustries.com/widget/support" 
      style={{
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        width: '380px', 
        height: '550px', 
        border: 'none', 
        zIndex: 99999, 
        background: 'transparent'
      }}
    />
  );
}

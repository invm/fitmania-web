//@ts-nocheck

const Spinner = ({ size = 1 }: { size?: number }) => (
  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 50, paddingBottom: 50 }}>
    <lottie-player
      src="https://assets2.lottiefiles.com/packages/lf20_jk6c1n2n.json"
      background="transparent"
      speed="1"
      style={{
        width: `${size * 100}px`,
        height: `${size * 100}px`,
      }}
      loop
      autoplay
    ></lottie-player>
  </div>
);
export default Spinner;

import { m } from 'framer-motion';

const fadeUpVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
};

const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const slideLeftVariants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
};

const slideRightVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
};

const scaleUpVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const staggerContainer = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const variantsMap = {
  fadeUp: fadeUpVariants,
  fadeIn: fadeInVariants,
  slideLeft: slideLeftVariants,
  slideRight: slideRightVariants,
  scaleUp: scaleUpVariants,
};

export function ScrollReveal({ 
  children, 
  delay = 0, 
  className = '', 
  style, 
  variant = 'fadeUp',
  viewport = { once: true, margin: '-50px' },
  ...props 
}) {
  return (
    <m.div
      initial="initial"
      whileInView="animate"
      viewport={viewport}
      variants={variantsMap[variant]}
      style={{ ...style, transitionDelay: delay }}
      className={className}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function StaggerContainer({ children, className = '', style, ...props }) {
  return (
    <m.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
      variants={staggerContainer}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className = '', style, ...props }) {
  return (
    <m.div variants={staggerItem} className={className} style={style} {...props}>
      {children}
    </m.div>
  );
}

const revealVariants = {
  fadeUp: fadeUpVariants,
  fadeIn: fadeInVariants,
  slideLeft: slideLeftVariants,
  slideRight: slideRightVariants,
  scaleUp: scaleUpVariants,
};
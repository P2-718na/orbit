
const f = (t, { x, dotX, t1, dotT1, t2, dotT2 }) => {
  /*
    // single pendulum equations
    const denominator = M + m*sin2(t1);
    const ddotX = (m*l*(dotT1**2)*sin(t1) + m*g*sin(t1)*cos(t1)) / denominator;
    const ddotT1 = (-m*l*(dotT1**2)*sin(t1)*cos(t1) - (m + M)*g*sin(t1)) / denominator / l;
  */

  const denominator =  -2*M + m*(cos(2*t1) - cos(2*t2) - 2)

  const ddotX =
    (
      m*(g*(sin(2*t1) + sin(2*t2)) + 2*l*sin(t1)*(dotT1**2) + 2*l*sin(t2)*(dotT2**2))
    )
    /
    (
      - denominator
    );

  const ddotT1 =
    (
      g*(3*m*sin(t1) + 2*M*sin(t1) - m*sin(t1 - 2*t2)) + 2*l*m*cos(t1)*sin(t2)*(dotT2**2) + l*m*sin(2*t1)*(dotT1**2)
    )
    /
    (
      l * denominator
    );

  const ddotT2 =
    (
      g*(3*m*sin(t2) + 2*M*sin(t2) - m*sin(t2 - 2*t1)) + 2*l*m*cos(t2)*sin(t1)*(dotT1**2) + l*m*sin(2*t2)*(dotT2**2)
    )
    /
    (
      l * denominator
    );

  return {
    x    : dotX,
    dotX : ddotX,
    t1   : dotT1,
    dotT1: ddotT1,
    t2   : dotT2,
    dotT2: ddotT2
  };
}

const fattr = (t, { x, dotX, t1, dotT1, t2, dotT2 }) => {
  const denominator =  -2*M + m*(cos(2*t1) - cos(2*t2) - 2)

  const ddotX =-((g*m*cos(t1)*sin(t1)+g*m*cos(t2)*sin(t2)+l*η*cos(t1)*dotT1+l*m*sin(t1)*pow(dotT1,2)+l*η*cos(t2)*dotT2+l*m*sin(t2)*pow(dotT2,2)+l*η*pow(cos(t1),2)*dotX+l*η*pow(cos(t2),2)*dotX)/(-2*m-M+m*pow(cos(t1),2)+m*pow(cos(t2),2)));
  /*
  (
    m*(g*(sin(2*t1) + sin(2*t2)) + 2*l*sin(t1)*(dotT1**2) + 2*l*sin(t2)*(dotT2**2))
    - l*eta*(2*cos(t1)*dotT1 + 2*cos(t2)*dotT2 + dotX*(2 + cos(2*t1) + cos(2*t2)))
  )
  /
  (
    - denominator
  );*/

  const ddotT1 = ((3*g*pow(m,2)*sin(t1))/2.+g*m*M*sin(t1)-(g*pow(m,2)*sin(t1-2*t2))/2.+l*η*(2*m+M-m*pow(cos(t2),2))*dotT1+l*pow(m,2)*cos(t1)*sin(t1)*pow(dotT1,2)+l*m*η*cos(t1)*cos(t2)*dotT2+l*pow(m,2)*cos(t1)*sin(t2)*pow(dotT2,2)+2*l*m*η*cos(t1)*dotX+l*M*η*cos(t1)*dotX)/(l*m*(-2*m-M+m*pow(cos(t1),2)+m*pow(cos(t2),2)))
  /*
  (
    g*(3*m*sin(t1) + 2*M*sin(t1) - m*sin(t1 - 2*t2)) + 2*l*m*cos(t1)*sin(t2)*(dotT2**2) + l*m*sin(2*t1)*(dotT1**2)
    + l*eta/m*((3*m + 2*M - m*cos(2*t2))*dotT1 + 2*cos(t1)*(m*cos(t2)*dotT2 + (2*m + M)*dotX))
  )
  /
  (
    l * denominator
  );*/


  const ddotT2 = (l*m*η*cos(t1)*cos(t2)*dotT1+l*pow(m,2)*cos(t2)*sin(t1)*pow(dotT1,2)+(g*m*(m*sin(2*t1-t2)+(3*m+2*M)*sin(t2))-l*η*(-3*m-2*M+m*cos(2*t1))*dotT2+l*pow(m,2)*sin(2*t2)*pow(dotT2,2)+2*l*(2*m+M)*η*cos(t2)*dotX)/2.)/(l*m*(-2*m-M+m*pow(cos(t1),2)+m*pow(cos(t2),2)))
  /*
  (
    g*(3*m*sin(t2) + 2*M*sin(t2) - m*sin(t2 - 2*t1)) + 2*l*m*cos(t2)*sin(t1)*(dotT1**2) + l*m*sin(2*t2)*(dotT2**2)
    + l*eta/m*((3*m + 2*M - m*cos(2*t1))*dotT2 + 2*cos(t2)*(m*cos(t1)*dotT1 + (2*m + M)*dotX))
  )
  /
  (
    l * denominator
  );*/

  return {
    x    : dotX,
    dotX : ddotX,
    t1   : dotT1,
    dotT1: ddotT1,
    t2   : dotT2,
    dotT2: ddotT2
  };
}

module.exports = { f, fattr };

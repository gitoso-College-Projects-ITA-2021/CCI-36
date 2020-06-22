function rk4(y, dydx, x, h, yout, derivs, params) {
    NA = y.length;

	var xh,hh,h6;
    var dym = [];
    dym.length = NA;
    var dyt = [];
    dyt.length = NA;
    var yt = [];
    yt.length = NA;

	hh=h*0.5;
	h6=h/6.0;
	xh=x+hh;

	for (var i = 0; i < NA; i++) 
    {
        yt[i] = y[i] + hh * dydx[i];
    }
	derivs(xh,yt,dyt, params);

	for (var i = 0; i < NA; i++) 
    {
        yt[i] = y[i] + hh * dyt[i];
    }
	derivs(xh,yt,dym, params);

	for (var i = 0; i < NA; i++) {
		yt[i] = y[i] + h * dym[i];
		dym[i] += dyt[i];
	}
	derivs(x+h,yt,dyt, params);

	for (var i = 0; i < NA; i++)
    {
        yout[i] = y[i] + h6 * (dydx[i] + dyt[i] + 2.0 * dym[i]);
    }
}
//x0 = x;  x2 = theta;
//x1 = x0';  x3 = x2';
//x0' = x1;
//x2' = x3;
//x1' = (l0 + x1)*x3^2  - k/m * x0 + g * cos(x2);
//x3' = -g/(l0+x0) * sin(x2) - 2 * x1/(l0 + x0) * x3;


function derivs (t, y, dydt, params) {
    dydt[0] = y[1];
    dydt[2] = y[3];
    dydt[1] = (params.l0 + y[1]) * y[3] * y[3] - params.k/params.m * y[0] + params.g * Math.cos(y[2]);
    dydt[3] = -params.g/(params.l0 + y[0]) * Math.sin(y[2]) - 2 * y[1]/(params.l0 + y[0]) * y[3];
}



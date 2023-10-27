import{w as ln,c as X}from"./path-53f90ab3.js";import{aW as an,aX as j,aY as w,aZ as rn,a_ as y,W as on,a$ as C,b0 as _,b1 as un,b2 as t,b3 as sn,b4 as tn,b5 as fn}from"./index-802ee214.js";function cn(l){return l.innerRadius}function yn(l){return l.outerRadius}function gn(l){return l.startAngle}function mn(l){return l.endAngle}function pn(l){return l&&l.padAngle}function dn(l,h,D,W,v,A,Y,a){var E=D-l,i=W-h,n=Y-v,m=a-A,r=m*E-n*i;if(!(r*r<y))return r=(n*(h-A)-m*(l-v))/r,[l+r*E,h+r*i]}function L(l,h,D,W,v,A,Y){var a=l-D,E=h-W,i=(Y?A:-A)/C(a*a+E*E),n=i*E,m=-i*a,r=l+n,s=h+m,f=D+n,c=W+m,Z=(r+f)/2,o=(s+c)/2,p=f-r,g=c-s,R=p*p+g*g,T=v-A,b=r*c-f*s,I=(g<0?-1:1)*C(fn(0,T*T*R-b*b)),O=(b*g-p*I)/R,S=(-b*p-g*I)/R,P=(b*g+p*I)/R,d=(-b*p+g*I)/R,x=O-Z,e=S-o,u=P-Z,$=d-o;return x*x+e*e>u*u+$*$&&(O=P,S=d),{cx:O,cy:S,x01:-n,y01:-m,x11:O*(v/T-1),y11:S*(v/T-1)}}function vn(){var l=cn,h=yn,D=X(0),W=null,v=gn,A=mn,Y=pn,a=null,E=ln(i);function i(){var n,m,r=+l.apply(this,arguments),s=+h.apply(this,arguments),f=v.apply(this,arguments)-rn,c=A.apply(this,arguments)-rn,Z=un(c-f),o=c>f;if(a||(a=n=E()),s<r&&(m=s,s=r,r=m),!(s>y))a.moveTo(0,0);else if(Z>on-y)a.moveTo(s*j(f),s*w(f)),a.arc(0,0,s,f,c,!o),r>y&&(a.moveTo(r*j(c),r*w(c)),a.arc(0,0,r,c,f,o));else{var p=f,g=c,R=f,T=c,b=Z,I=Z,O=Y.apply(this,arguments)/2,S=O>y&&(W?+W.apply(this,arguments):C(r*r+s*s)),P=_(un(s-r)/2,+D.apply(this,arguments)),d=P,x=P,e,u;if(S>y){var $=sn(S/r*w(O)),F=sn(S/s*w(O));(b-=$*2)>y?($*=o?1:-1,R+=$,T-=$):(b=0,R=T=(f+c)/2),(I-=F*2)>y?(F*=o?1:-1,p+=F,g-=F):(I=0,p=g=(f+c)/2)}var z=s*j(p),B=s*w(p),G=r*j(T),H=r*w(T);if(P>y){var J=s*j(g),K=s*w(g),M=r*j(R),N=r*w(R),q;if(Z<an)if(q=dn(z,B,M,N,J,K,G,H)){var Q=z-q[0],U=B-q[1],V=J-q[0],k=K-q[1],nn=1/w(tn((Q*V+U*k)/(C(Q*Q+U*U)*C(V*V+k*k)))/2),en=C(q[0]*q[0]+q[1]*q[1]);d=_(P,(r-en)/(nn-1)),x=_(P,(s-en)/(nn+1))}else d=x=0}I>y?x>y?(e=L(M,N,z,B,s,x,o),u=L(J,K,G,H,s,x,o),a.moveTo(e.cx+e.x01,e.cy+e.y01),x<P?a.arc(e.cx,e.cy,x,t(e.y01,e.x01),t(u.y01,u.x01),!o):(a.arc(e.cx,e.cy,x,t(e.y01,e.x01),t(e.y11,e.x11),!o),a.arc(0,0,s,t(e.cy+e.y11,e.cx+e.x11),t(u.cy+u.y11,u.cx+u.x11),!o),a.arc(u.cx,u.cy,x,t(u.y11,u.x11),t(u.y01,u.x01),!o))):(a.moveTo(z,B),a.arc(0,0,s,p,g,!o)):a.moveTo(z,B),!(r>y)||!(b>y)?a.lineTo(G,H):d>y?(e=L(G,H,J,K,r,-d,o),u=L(z,B,M,N,r,-d,o),a.lineTo(e.cx+e.x01,e.cy+e.y01),d<P?a.arc(e.cx,e.cy,d,t(e.y01,e.x01),t(u.y01,u.x01),!o):(a.arc(e.cx,e.cy,d,t(e.y01,e.x01),t(e.y11,e.x11),!o),a.arc(0,0,r,t(e.cy+e.y11,e.cx+e.x11),t(u.cy+u.y11,u.cx+u.x11),o),a.arc(u.cx,u.cy,d,t(u.y11,u.x11),t(u.y01,u.x01),!o))):a.arc(0,0,r,T,R,o)}if(a.closePath(),n)return a=null,n+""||null}return i.centroid=function(){var n=(+l.apply(this,arguments)+ +h.apply(this,arguments))/2,m=(+v.apply(this,arguments)+ +A.apply(this,arguments))/2-an/2;return[j(m)*n,w(m)*n]},i.innerRadius=function(n){return arguments.length?(l=typeof n=="function"?n:X(+n),i):l},i.outerRadius=function(n){return arguments.length?(h=typeof n=="function"?n:X(+n),i):h},i.cornerRadius=function(n){return arguments.length?(D=typeof n=="function"?n:X(+n),i):D},i.padRadius=function(n){return arguments.length?(W=n==null?null:typeof n=="function"?n:X(+n),i):W},i.startAngle=function(n){return arguments.length?(v=typeof n=="function"?n:X(+n),i):v},i.endAngle=function(n){return arguments.length?(A=typeof n=="function"?n:X(+n),i):A},i.padAngle=function(n){return arguments.length?(Y=typeof n=="function"?n:X(+n),i):Y},i.context=function(n){return arguments.length?(a=n??null,i):a},i}export{vn as a};
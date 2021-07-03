import { newEnforcer, newModelFromString, StringAdapter } from 'casbin';

// model
const basicModel = `
[request_definition]
r = sub, obj, act
[policy_definition]
p = sub, obj, act
[role_definition]
g = _, _
[policy_effect]
e = some(where (p.eft == allow))
[matchers]
m = (g(r.sub, p.sub) || r.sub == p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
`;
// m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
// m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act

// adapter
// const basicPolicy = `
// p, ENTIDAD, /entidades, GET
// p, ADMIN, /usuarios, (GET)|(POST)
// p, ADMIN, /entidades, (GET)|(POST)
// g, admin, ADMIN
// g, entidad, ENTIDAD
// `;

// customPolicy
// p, rol, ruta, accion, label, icon, padre
// const basicPolicy = `
// p, ENTIDAD, /entidades, GET, Lista Entidades, home, /admin
// p, ADMIN, /usuarios, (GET)|(POST), Lista Usuarios, user, /admin
// p, ADMIN, /entidades, (GET)|(POST), Lista Entidades, home, /admin
// g, admin, ADMIN
// g, entidad, ENTIDAD
// t, , /admin, Administracion, config, /
// t, , /admin, Menu de usuario, config, /
// `;

const basicPolicy = `
g, admin, ADMINISTRADOR
`;
const model = newModelFromString(basicModel);
const policy = new StringAdapter(basicPolicy);

const $Casbin = {
  enforcer: null,
  getStorage: (key) => {
    const appName = process.env.VUE_APP_SITENAME || 'app';
    const data = window.localStorage.getItem(`${appName}_${key}`);
    try {
      return JSON.parse(data);
    } catch (Exception) {
      return data;
    }
  },
};

newEnforcer(model, policy).then(async (enforcer) => {
  $Casbin.enforcer = enforcer;
  const politicas = $Casbin.getStorage('policy');
  if (politicas) {
    for (const p of politicas) {
      $Casbin.enforcer.addPolicy(p[0], p[1], p[2], p[3], p[4], p[5]);
    }
  }
});

export { $Casbin };

export default {
  install: (Vue) => {
    // console.log('install casbin', config); // Configuracion desde .env
    Vue.prototype.$Casbin = $Casbin;
  }
};

/* eslint-disable */
import { $Casbin } from '@/plugins/casbin';

export default {
  methods: {
    $check : async (rol, resource, action) => {
      if ($Casbin && $Casbin.enforcer) {
        const rolString = (rol && rol.rol) ? rol.rol : rol;
        return $Casbin.enforcer.enforce(rolString, resource, action)
          .then(permitido => {
            return permitido;
          });
      }
      return false;
    }
  }
};

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  language: state => state.app.language,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,

  size: state => state.app.size,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  setting: state => state.user.setting,
  permissionRouters: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
  user: state => state.user.user,
  insuranceArr: state => state.car_manage.insuranceArr,
  lineinfoArr: state => state.car_manage.lineinfoArr,
  companyId: state => state.team.companyId
}

export default getters

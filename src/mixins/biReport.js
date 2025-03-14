import { getFineBiTokenApi } from "@/api/common/index"
import { getStore } from "@/util/store"

// reportId 仪表板id
export default function (reportId) {
  return {
    data() {
      return {
        fineAuthTokenUrl: `https://report.sweetnight.com.cn/decision/v5/design/report/${reportId}/view`,
        fineAuthToken: ""
      }
    },
    created() {
      this.getFineAuthToken()
    },
    methods: {
      getFineAuthToken() {
        const userInfo = getStore({ name: "user_info", type: "session" })
        const { username } = userInfo
        getFineBiTokenApi({ username })
          .then(({ data }) => {
            this.fineAuthToken = data.data
            this.setUrl()
          })
          .catch((e) => {
            this.msg = "暂无权限，请联系管理员开通权限"
          })
      },
      setUrl() {
        this.url = this.fineAuthTokenUrl + `?fine_auth_token=${this.fineAuthToken}`
      }
    }
  }
}

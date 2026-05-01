import AuthForm from '../components/AuthForm'
import Layout from '../components/Layout'

export default function LoginPage() {
  return (
    <Layout title="Login">
      <AuthForm mode="login" />
    </Layout>
  )
}

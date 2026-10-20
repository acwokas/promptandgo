import importlib.util,pathlib,unittest
spec=importlib.util.spec_from_file_location('gate',pathlib.Path(__file__).with_name('check-data-api-grants.py'));g=importlib.util.module_from_spec(spec);spec.loader.exec_module(g)
class Grants(unittest.TestCase):
 def test_missing_grants_despite_policy(self):self.assertTrue(g.validate('CREATE TABLE public.x(id int); ALTER TABLE public.x ENABLE ROW LEVEL SECURITY; CREATE POLICY p ON public.x FOR SELECT TO anon USING(true);','x'))
 def test_explicit_read_requires_rls_and_policy(self):
  s='CREATE TABLE public.x(id int); GRANT SELECT ON TABLE public.x TO anon;'
  self.assertEqual(len(g.validate(s,'x')),2)
  self.assertEqual(g.validate(s+' ALTER TABLE public.x ENABLE ROW LEVEL SECURITY; CREATE POLICY p ON public.x FOR SELECT TO anon USING(true);','x'),[])
 def test_deny_policy_is_not_positive_access(self):
  s='CREATE TABLE public.x(id int); ALTER TABLE public.x ENABLE ROW LEVEL SECURITY; CREATE POLICY deny ON public.x FOR SELECT TO anon USING(false); GRANT SELECT ON public.x TO anon;'
  self.assertTrue(g.validate(s,'x'))
 def test_quoted_identifiers(self):
  self.assertEqual(g.validate('CREATE TABLE public."x"(id int); GRANT SELECT ON TABLE public."x" TO anon; ALTER TABLE public."x" ENABLE ROW LEVEL SECURITY; CREATE POLICY p ON public."x" FOR SELECT TO anon USING(true);','x'),[])
 def test_private_named_table_and_schema_boundary(self):
  self.assertEqual(g.validate('-- Data API private: x (owner RPC only)\nCREATE TABLE public.x(id int);','x'),[])
  self.assertEqual(g.declarations('CREATE TABLE private.x(id int); CREATE TABLE public.y(id int);'),[('y',len('CREATE TABLE private.x(id int); '))])
 def test_serial_usage_required_and_no_schema_wide_shortcut(self):
  s='CREATE TABLE public.x(id bigserial); GRANT INSERT ON TABLE public.x TO service_role;'
  self.assertTrue(g.validate(s,'x'));self.assertEqual(g.validate(s+' GRANT USAGE ON SEQUENCE public.x_id_seq TO service_role;','x'),[])
  self.assertTrue(g.validate('CREATE TABLE public.x(id int); GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;','x'))
if __name__=='__main__':unittest.main()

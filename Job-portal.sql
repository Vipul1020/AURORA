--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-13 11:32:07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 863 (class 1247 OID 16500)
-- Name: enum_applications_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_applications_status AS ENUM (
    'applied',
    'viewed',
    'shortlisted',
    'rejected'
);


ALTER TYPE public.enum_applications_status OWNER TO postgres;

--
-- TOC entry 872 (class 1247 OID 16816)
-- Name: enum_jobs_experienceLevel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_jobs_experienceLevel" AS ENUM (
    'Internship',
    'Entry-level',
    'Mid-level',
    'Senior-level',
    'Lead',
    'Executive'
);


ALTER TYPE public."enum_jobs_experienceLevel" OWNER TO postgres;

--
-- TOC entry 857 (class 1247 OID 16476)
-- Name: enum_jobs_jobType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_jobs_jobType" AS ENUM (
    'Full-time',
    'Part-time',
    'Internship',
    'Contract'
);


ALTER TYPE public."enum_jobs_jobType" OWNER TO postgres;

--
-- TOC entry 869 (class 1247 OID 16808)
-- Name: enum_jobs_salaryPeriod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_jobs_salaryPeriod" AS ENUM (
    'Yearly',
    'Monthly',
    'Hourly'
);


ALTER TYPE public."enum_jobs_salaryPeriod" OWNER TO postgres;

--
-- TOC entry 851 (class 1247 OID 16458)
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'candidate',
    'recruiter'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16510)
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    status public.enum_applications_status DEFAULT 'applied'::public.enum_applications_status NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "candidateId" integer,
    "jobId" integer
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16509)
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_id_seq OWNER TO postgres;

--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 221
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- TOC entry 220 (class 1259 OID 16486)
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    location character varying(255),
    "jobType" public."enum_jobs_jobType",
    "companyName" character varying(255),
    keywords text[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "recruiterId" integer,
    "salaryMin" integer,
    "salaryMax" integer,
    "salaryCurrency" character varying(255) DEFAULT 'INR'::character varying,
    "salaryPeriod" public."enum_jobs_salaryPeriod",
    "experienceLevel" public."enum_jobs_experienceLevel"
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16485)
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO postgres;

--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 219
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- TOC entry 218 (class 1259 OID 16464)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "firstName" character varying(255),
    "lastName" character varying(255),
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_users_role DEFAULT 'candidate'::public.enum_users_role NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    skills text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16463)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4772 (class 2604 OID 16513)
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- TOC entry 4770 (class 2604 OID 16489)
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- TOC entry 4767 (class 2604 OID 16467)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4973 (class 2606 OID 16516)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4971 (class 2606 OID 16493)
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 4775 (class 2606 OID 28365)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4777 (class 2606 OID 28367)
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- TOC entry 4779 (class 2606 OID 28223)
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- TOC entry 4781 (class 2606 OID 28225)
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- TOC entry 4783 (class 2606 OID 28363)
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- TOC entry 4785 (class 2606 OID 28227)
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- TOC entry 4787 (class 2606 OID 28361)
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- TOC entry 4789 (class 2606 OID 28229)
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- TOC entry 4791 (class 2606 OID 28359)
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- TOC entry 4793 (class 2606 OID 28231)
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- TOC entry 4795 (class 2606 OID 28233)
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- TOC entry 4797 (class 2606 OID 28345)
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- TOC entry 4799 (class 2606 OID 28369)
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- TOC entry 4801 (class 2606 OID 28235)
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- TOC entry 4803 (class 2606 OID 28237)
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- TOC entry 4805 (class 2606 OID 28239)
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- TOC entry 4807 (class 2606 OID 28241)
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- TOC entry 4809 (class 2606 OID 28325)
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- TOC entry 4811 (class 2606 OID 28343)
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- TOC entry 4813 (class 2606 OID 28327)
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- TOC entry 4815 (class 2606 OID 28329)
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- TOC entry 4817 (class 2606 OID 28331)
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- TOC entry 4819 (class 2606 OID 28341)
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- TOC entry 4821 (class 2606 OID 28371)
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- TOC entry 4823 (class 2606 OID 28339)
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- TOC entry 4825 (class 2606 OID 28333)
-- Name: users users_email_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key31 UNIQUE (email);


--
-- TOC entry 4827 (class 2606 OID 28335)
-- Name: users users_email_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key32 UNIQUE (email);


--
-- TOC entry 4829 (class 2606 OID 28337)
-- Name: users users_email_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key33 UNIQUE (email);


--
-- TOC entry 4831 (class 2606 OID 28247)
-- Name: users users_email_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key34 UNIQUE (email);


--
-- TOC entry 4833 (class 2606 OID 28249)
-- Name: users users_email_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key35 UNIQUE (email);


--
-- TOC entry 4835 (class 2606 OID 28251)
-- Name: users users_email_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key36 UNIQUE (email);


--
-- TOC entry 4837 (class 2606 OID 28185)
-- Name: users users_email_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key37 UNIQUE (email);


--
-- TOC entry 4839 (class 2606 OID 28253)
-- Name: users users_email_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key38 UNIQUE (email);


--
-- TOC entry 4841 (class 2606 OID 28259)
-- Name: users users_email_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key39 UNIQUE (email);


--
-- TOC entry 4843 (class 2606 OID 28245)
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- TOC entry 4845 (class 2606 OID 28255)
-- Name: users users_email_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key40 UNIQUE (email);


--
-- TOC entry 4847 (class 2606 OID 28257)
-- Name: users users_email_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key41 UNIQUE (email);


--
-- TOC entry 4849 (class 2606 OID 28243)
-- Name: users users_email_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key42 UNIQUE (email);


--
-- TOC entry 4851 (class 2606 OID 28373)
-- Name: users users_email_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key43 UNIQUE (email);


--
-- TOC entry 4853 (class 2606 OID 28375)
-- Name: users users_email_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key44 UNIQUE (email);


--
-- TOC entry 4855 (class 2606 OID 28213)
-- Name: users users_email_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key45 UNIQUE (email);


--
-- TOC entry 4857 (class 2606 OID 28221)
-- Name: users users_email_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key46 UNIQUE (email);


--
-- TOC entry 4859 (class 2606 OID 28215)
-- Name: users users_email_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key47 UNIQUE (email);


--
-- TOC entry 4861 (class 2606 OID 28219)
-- Name: users users_email_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key48 UNIQUE (email);


--
-- TOC entry 4863 (class 2606 OID 28217)
-- Name: users users_email_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key49 UNIQUE (email);


--
-- TOC entry 4865 (class 2606 OID 28187)
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- TOC entry 4867 (class 2606 OID 28315)
-- Name: users users_email_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key50 UNIQUE (email);


--
-- TOC entry 4869 (class 2606 OID 28189)
-- Name: users users_email_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key51 UNIQUE (email);


--
-- TOC entry 4871 (class 2606 OID 28313)
-- Name: users users_email_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key52 UNIQUE (email);


--
-- TOC entry 4873 (class 2606 OID 28311)
-- Name: users users_email_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key53 UNIQUE (email);


--
-- TOC entry 4875 (class 2606 OID 28309)
-- Name: users users_email_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key54 UNIQUE (email);


--
-- TOC entry 4877 (class 2606 OID 28191)
-- Name: users users_email_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key55 UNIQUE (email);


--
-- TOC entry 4879 (class 2606 OID 28295)
-- Name: users users_email_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key56 UNIQUE (email);


--
-- TOC entry 4881 (class 2606 OID 28193)
-- Name: users users_email_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key57 UNIQUE (email);


--
-- TOC entry 4883 (class 2606 OID 28293)
-- Name: users users_email_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key58 UNIQUE (email);


--
-- TOC entry 4885 (class 2606 OID 28195)
-- Name: users users_email_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key59 UNIQUE (email);


--
-- TOC entry 4887 (class 2606 OID 28317)
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- TOC entry 4889 (class 2606 OID 28291)
-- Name: users users_email_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key60 UNIQUE (email);


--
-- TOC entry 4891 (class 2606 OID 28197)
-- Name: users users_email_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key61 UNIQUE (email);


--
-- TOC entry 4893 (class 2606 OID 28289)
-- Name: users users_email_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key62 UNIQUE (email);


--
-- TOC entry 4895 (class 2606 OID 28199)
-- Name: users users_email_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key63 UNIQUE (email);


--
-- TOC entry 4897 (class 2606 OID 28287)
-- Name: users users_email_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key64 UNIQUE (email);


--
-- TOC entry 4899 (class 2606 OID 28285)
-- Name: users users_email_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key65 UNIQUE (email);


--
-- TOC entry 4901 (class 2606 OID 28201)
-- Name: users users_email_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key66 UNIQUE (email);


--
-- TOC entry 4903 (class 2606 OID 28263)
-- Name: users users_email_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key67 UNIQUE (email);


--
-- TOC entry 4905 (class 2606 OID 28265)
-- Name: users users_email_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key68 UNIQUE (email);


--
-- TOC entry 4907 (class 2606 OID 28283)
-- Name: users users_email_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key69 UNIQUE (email);


--
-- TOC entry 4909 (class 2606 OID 28319)
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- TOC entry 4911 (class 2606 OID 28267)
-- Name: users users_email_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key70 UNIQUE (email);


--
-- TOC entry 4913 (class 2606 OID 28281)
-- Name: users users_email_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key71 UNIQUE (email);


--
-- TOC entry 4915 (class 2606 OID 28279)
-- Name: users users_email_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key72 UNIQUE (email);


--
-- TOC entry 4917 (class 2606 OID 28269)
-- Name: users users_email_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key73 UNIQUE (email);


--
-- TOC entry 4919 (class 2606 OID 28271)
-- Name: users users_email_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key74 UNIQUE (email);


--
-- TOC entry 4921 (class 2606 OID 28277)
-- Name: users users_email_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key75 UNIQUE (email);


--
-- TOC entry 4923 (class 2606 OID 28273)
-- Name: users users_email_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key76 UNIQUE (email);


--
-- TOC entry 4925 (class 2606 OID 28275)
-- Name: users users_email_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key77 UNIQUE (email);


--
-- TOC entry 4927 (class 2606 OID 28261)
-- Name: users users_email_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key78 UNIQUE (email);


--
-- TOC entry 4929 (class 2606 OID 28203)
-- Name: users users_email_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key79 UNIQUE (email);


--
-- TOC entry 4931 (class 2606 OID 28321)
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- TOC entry 4933 (class 2606 OID 28205)
-- Name: users users_email_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key80 UNIQUE (email);


--
-- TOC entry 4935 (class 2606 OID 28211)
-- Name: users users_email_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key81 UNIQUE (email);


--
-- TOC entry 4937 (class 2606 OID 28207)
-- Name: users users_email_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key82 UNIQUE (email);


--
-- TOC entry 4939 (class 2606 OID 28209)
-- Name: users users_email_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key83 UNIQUE (email);


--
-- TOC entry 4941 (class 2606 OID 28357)
-- Name: users users_email_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key84 UNIQUE (email);


--
-- TOC entry 4943 (class 2606 OID 28347)
-- Name: users users_email_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key85 UNIQUE (email);


--
-- TOC entry 4945 (class 2606 OID 28355)
-- Name: users users_email_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key86 UNIQUE (email);


--
-- TOC entry 4947 (class 2606 OID 28353)
-- Name: users users_email_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key87 UNIQUE (email);


--
-- TOC entry 4949 (class 2606 OID 28349)
-- Name: users users_email_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key88 UNIQUE (email);


--
-- TOC entry 4951 (class 2606 OID 28351)
-- Name: users users_email_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key89 UNIQUE (email);


--
-- TOC entry 4953 (class 2606 OID 28323)
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- TOC entry 4955 (class 2606 OID 28307)
-- Name: users users_email_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key90 UNIQUE (email);


--
-- TOC entry 4957 (class 2606 OID 28297)
-- Name: users users_email_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key91 UNIQUE (email);


--
-- TOC entry 4959 (class 2606 OID 28299)
-- Name: users users_email_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key92 UNIQUE (email);


--
-- TOC entry 4961 (class 2606 OID 28305)
-- Name: users users_email_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key93 UNIQUE (email);


--
-- TOC entry 4963 (class 2606 OID 28301)
-- Name: users users_email_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key94 UNIQUE (email);


--
-- TOC entry 4965 (class 2606 OID 28303)
-- Name: users users_email_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key95 UNIQUE (email);


--
-- TOC entry 4967 (class 2606 OID 28183)
-- Name: users users_email_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key96 UNIQUE (email);


--
-- TOC entry 4969 (class 2606 OID 16472)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4975 (class 2606 OID 28389)
-- Name: applications applications_candidateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4976 (class 2606 OID 28394)
-- Name: applications applications_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public.jobs(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4974 (class 2606 OID 28380)
-- Name: jobs jobs_recruiterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT "jobs_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2025-05-13 11:32:08

--
-- PostgreSQL database dump complete
--


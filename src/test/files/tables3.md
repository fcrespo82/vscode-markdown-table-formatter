
|   Host   |    VM    | IP           | Núcleos | RAM | Disco | Finalidade         | Responsável |
|:--------:|:--------:|:-------------|:-------:|:---:|:-----:|:-------------------|:------------|
| alsrv414 | alsrv903 | 172.20.48.3  |    2    | 8GB | 40GB  | CaaS Adm           | SSys        |
|          | alsrv904 | 172.20.48.4  |    2    | 8GB | 40GB  | CaaS M1            | SSys        |
|          | alsrv905 | 172.20.48.5  |    2    | 8GB | 40GB  | CaaS W1            | SSys        |
|          | alsrv906 | 172.20.48.6  |    2    | 8GB | 40GB  | CaaS W2            | SSys        |
| alsrv415 |          |              |         |     |       |                    | adcarvalho  |
| alsrv416 | alsrv907 | 172.20.48.7  |         |     |       | OpenShift M1       | SManager    |
| alsrv417 | alsrv908 | 172.20.48.8  |         |     |       | OpenShift M2       | SManager    |
| alsrv418 | alsrv909 | 172.20.48.9  |         |     |       | OpenShift I1       | SManager    |
|          | alsrv910 | 172.20.48.10 |         |     |       | OpenShift I2       | SManager    |
| alsrv419 |          |              |         |     |       |                    | adcarvalho  |
| alsrv420 | alsrv911 | 172.20.48.11 |         |     |       | OpenShift AppNode1 | SManager    |
|          | alsrv912 | 172.20.48.12 |         |     |       | OpenShift AppNode2 | SManager    |
| alsrv421 | alsrv913 | 172.20.48.13 |         |     |       | OpenShift Bastion  | SManager    |
| alsrv422 | alsrv995 | 172.20.48.95 |    2    | 8GB | 100GB | NAM                | fxcrespo    |
|          | alsrv990 | 172.20.48.90 |    2    | 8GB | 40GB  | Docker Swarm       | adcarvalho  |
|          | alsrv992 | 172.20.48.92 |    2    | 8GB | 40GB  | Docker Swarm       | adcarvalho  |
|          | alsrv993 | 172.20.48.93 |    2    | 8GB | 40GB  | Docker Swarm       | adcarvalho  |




|                                      |                                        |
|--------------------------------------|----------------------------------------|
| abc                                  | defghi                                 |
|                                      |                                        |
|                                      |                                        |

| Foo                                   | Bar                                   |
|---------------------------------------|---------------------------------------|
| Baz                                   | Qux                                   |

|                                   Foo | Bar                                   |
|--------------------------------------:|---------------------------------------|
|                                   Baz | Qux                                   |




| Hostname              | IP                        |          Usado?           |
|-----------------------|---------------------------|:-------------------------:|
| alsrv903              | 172.20.48.3               |          POC KUB          |
| alsrv904              | 172.20.48.4               |          POC KUB          |
| alsrv905              | 172.20.48.5               |          POC KUB          |
| alsrv906              | 172.20.48.6               |          POC KUB          |
| alsrv907              | 172.20.48.7               |          POC KUB          |
| alsrv908              | 172.20.48.8               |          POC KUB          |
| alsrv909              | 172.20.48.9               |          POC KUB          |
| alsrv910              | 172.20.48.10              |          POC KUB          |
| alsrv911              | 172.20.48.11              |          POC KUB          |
| alsrv912              | 172.20.48.12              |          POC KUB          |
| alsrv913              | 172.20.48.13              |          POC KUB          |
| alsrv914              | 172.20.48.14              |          POC KUB          |
| alsrv923              | 172.20.48.23              |             -             |
| alsrv924              | 172.20.48.24              |             -             |
| alsrv925              | 172.20.48.25              |             -             |
| alsrv926              | 172.20.48.26              |       archivematica       |
| alsrv950              | 172.20.48.50              |          Traefik          |
| alsrv951              | 172.20.48.51              |         Docker 01         |
| alsrv952              | 172.20.48.52              |         Docker 02         |
| alsrv953              | 172.20.48.53              |         Docker 03         |
| alsrv954              | 172.20.48.54              |         Docker 04         |
| alsrv959              | 172.20.48.59              |        NFS-Server         |
| alsrv990              | 172.20.48.90              |       Test DOCKER01       |
| alsrv991              | 172.20.48.91              |         ddo@atom          |
| alsrv992              | 172.20.48.92              |       Test DOCKER02       |
| alsrv993              | 172.20.48.93              |       Test DOCKER03       |
| alsrv994              | 172.20.48.94              |       Test DOCKER04       |
| alsrv995              | 172.20.48.95              |          NAM DEV          |


| Configuração                     | Valor                                      |
|----------------------------------|--------------------------------------------|
| hostname                         | um daqueles da lista que passei (alsrv9xx) |
| IP                               | um daqueles da lista que passei            |
| CIDR                             | 172.20.0.0/16                              |
| mascara                          | 255.255.0.0                                |
| domainname                       | al.sp.gov.br                               |
| DNS 1                            | 172.20.0.15                                |
| DNS 2                            | 172.20.0.9                                 |
| gateway                          | 172.20.30.100                              |
| DNS search list ou search domain | al.sp.gov.br                               |
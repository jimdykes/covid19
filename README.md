# covid19
Project Epic's COVID19 Data Visualizations


The `docs` directory can be viewed at epic.cs.colorado.edu/covid19

### What's in this Repository

Files in the `config` directory define which retweet/reply diffusion pages will be generated and available at epic.cs.colorado.edu/covid19. Only files with `.yaml` extensions will be generated. To pause generation for a specific file, simply change the extension to `.disabled`

The `templates` directory contains HTML templates for the `mustache` templating engine. These are very bare-bones, however, as much of the actual page is populated by javascript at run time. 

All javascript files are in the `docs/js/` directory. 

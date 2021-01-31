import { HandlebarsViewEngine } from "https://deno.land/x/momentum@v0.6.3/mvc-handlebars/handlebars-view-engine.ts";
import { MvcHandlebarsModule } from "https://deno.land/x/momentum@v0.6.3/mvc-handlebars/mvc-handlebars.module.ts";
import { StaticFileModule } from "https://deno.land/x/momentum@v0.6.3/static-files/static-file.module.ts";
import {
  Controller,
  Get,
  Injectable,
  MvcModule,
  MvModule,
  Param,
  platformOak,
  View,
} from "./deps.ts";

@Injectable({ global: false })
class GreetingService {
  getGreeting(name: string) {
    return `Hello, ${name}!`;
  }
}

@Controller("rest")
class RestController {
  constructor(private readonly greetingService: GreetingService) {}
  @Get(":name")
  get(@Param("name") name: string) {
    return this.greetingService.getGreeting(name);
  }
}

@Controller("mvc")
class MvcController {
  constructor(private readonly greetingService: GreetingService) {}
  @Get()
  @View("index")
  get() {
    return { message: this.greetingService.getGreeting("Momentum") };
  }
}

@MvModule({
  imports: [
    MvcModule.register({
      viewEngineModule: MvcHandlebarsModule,
      config: {
        defaultLayout: false,
      },
    }),
    StaticFileModule,
  ],
  providers: [GreetingService],
  controllers: [RestController, MvcController],
})
class AppModule {}

const platform = await platformOak().bootstrapModule(AppModule);

await platform.listen({ port: 3000 });

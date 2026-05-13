package cmtapira.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cmtapira.dto.SessaoDTO;
import cmtapira.service.ReuniaoService;

@RestController
public class ReuniaoController {
    
    private final ReuniaoService reuniaoService;
    
    public ReuniaoController(ReuniaoService reuniaoService) {
        this.reuniaoService = reuniaoService;
    }

    @GetMapping("/api/reunioes")
    public List<SessaoDTO> buscarReunioes(

        @RequestParam(required = false) String tipo,
        @RequestParam(required = false) String ano,
        @RequestParam(required = false) String mes,
        @RequestParam(required = false) String dia
    ) {
        
        return reuniaoService.buscarSessoes(tipo, ano, mes, dia);
    }

    @GetMapping("/api/reunioes/{id}")
    public SessaoDTO buscarReuniaoPorId(@PathVariable Integer id) {
        return reuniaoService.buscarSessaoPorId(id);
    }

}

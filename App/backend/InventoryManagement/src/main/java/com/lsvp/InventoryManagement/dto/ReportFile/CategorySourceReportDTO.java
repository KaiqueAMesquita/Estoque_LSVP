package com.lsvp.InventoryManagement.dto.ReportFile;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategorySourceReportDTO {

    private String categoryName;
    private List<SourceComparasionDTO> sources; 

}
